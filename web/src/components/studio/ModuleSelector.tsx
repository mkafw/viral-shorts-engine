'use client';

/**
 * 电影模块选择器
 *
 * 从 prompt-tool 移植的可视化模块选择器
 * 标签页 + 网格选择 + 已选摘要 + 模板切换
 */
import { useState, useMemo, useCallback } from 'react';
import { MODULE_TYPES, MODULE_INSTANCES, PROMPT_TEMPLATES } from '@/lib/studio/modules/data';
import type { ModuleSelections } from '@/lib/studio/modules/engine';
import { ChevronDown, ChevronUp, X, Film } from 'lucide-react';

// ==================== 类型 ====================

export interface ModuleSelectorState {
  selections: ModuleSelections;
  templateId: string;
}

interface ModuleSelectorProps {
  /** 当前选中的模块 */
  selections: ModuleSelections;
  /** 当选中的模块变更时 */
  onChange: (selections: ModuleSelections) => void;
  /** 当前选择的模板 ID */
  templateId: string;
  /** 当模板变更时 */
  onTemplateChange: (id: string) => void;
  /** 模块选择器预览的提示词文本 */
  promptText?: string;
  /** 是否展开（默认展开） */
  defaultExpanded?: boolean;
}

// ==================== 组件 ====================

export default function ModuleSelector({
  selections,
  onChange,
  templateId,
  onTemplateChange,
  promptText,
  defaultExpanded = true,
}: ModuleSelectorProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [activeTab, setActiveTab] = useState<string>(MODULE_TYPES[0]?.type || 'Character');

  const activeType = MODULE_TYPES.find(t => t.type === activeTab);

  /** 切换模块选中 */
  const handleToggle = useCallback((code: string, type: string, multiple: boolean) => {
    const key = type === 'NegativePrompt' ? 'negative_prompt'
      : type === 'GenerationParams' ? 'generation_params'
      : type.toLowerCase() + (type === 'Prop' || type === 'Sequence' ? 's' : '');

    const prev = selections[key as keyof ModuleSelections];

    if (multiple) {
      const arr: string[] = Array.isArray(prev) ? [...prev] : [];
      const idx = arr.indexOf(code);
      if (idx >= 0) arr.splice(idx, 1);
      else arr.push(code);
      onChange({ ...selections, [key]: arr.length > 0 ? arr : undefined });
    } else {
      if (prev === code) {
        onChange({ ...selections, [key]: undefined });
      } else {
        onChange({ ...selections, [key]: code });
      }
    }
  }, [selections, onChange]);

  /** 移除已选模块 */
  const handleRemove = useCallback((type: string, code: string) => {
    const key = type === 'NegativePrompt' ? 'negative_prompt'
      : type === 'GenerationParams' ? 'generation_params'
      : type.toLowerCase() + (type === 'Prop' || type === 'Sequence' ? 's' : '');
    const prev = selections[key as keyof ModuleSelections];
    if (Array.isArray(prev)) {
      const arr = prev.filter(c => c !== code);
      onChange({ ...selections, [key]: arr.length > 0 ? arr : undefined });
    } else {
      onChange({ ...selections, [key]: undefined });
    }
  }, [selections, onChange]);

  /** 获取当前类型的选中值 */
  const getSelected = (type: string): string | string[] | undefined => {
    const key = type === 'NegativePrompt' ? 'negative_prompt'
      : type === 'GenerationParams' ? 'generation_params'
      : type.toLowerCase() + (type === 'Prop' || type === 'Sequence' ? 's' : '');
    return selections[key as keyof ModuleSelections] as string | string[] | undefined;
  };

  /** 当前类型的所有实例 */
  const instances = MODULE_INSTANCES[activeTab] || [];

  /** 所有已选模块的摘要 */
  const selectedSummary = useMemo(() => {
    const items: { type: string; icon: string; code: string; name: string }[] = [];
    for (const def of MODULE_TYPES) {
      const val = getSelected(def.type);
      if (!val) continue;
      const allInstances = MODULE_INSTANCES[def.type] || [];
      if (Array.isArray(val)) {
        for (const code of val) {
          const inst = allInstances.find(i => i.code === code);
          if (inst) items.push({ type: def.type, icon: def.icon, code, name: inst.name as string });
        }
      } else {
        const inst = allInstances.find(i => i.code === val);
        if (inst) items.push({ type: def.type, icon: def.icon, code: val, name: inst.name as string });
      }
    }
    return items;
  }, [selections]);

  return (
    <div className="bg-neutral-900/40 border border-neutral-800/80 rounded-xl overflow-hidden">
      {/* 折叠头部 */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-3 py-2 bg-neutral-900/60 border-b border-neutral-800/80 hover:bg-neutral-800/40 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Film className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-xs font-bold text-neutral-200">电影模块</span>
          {selectedSummary.length > 0 && (
            <span className="text-[10px] text-amber-400/80 bg-amber-500/10 px-1.5 py-0.5 rounded-full">
              {selectedSummary.length} 个
            </span>
          )}
        </div>
        {expanded ? <ChevronUp className="w-3.5 h-3.5 text-neutral-500" /> : <ChevronDown className="w-3.5 h-3.5 text-neutral-500" />}
      </button>

      {expanded && (
        <div className="p-2 space-y-2">
          {/* 已选摘要 */}
          {selectedSummary.length > 0 && (
            <div className="flex flex-wrap gap-1 px-1">
              {selectedSummary.map(item => (
                <span
                  key={item.code}
                  className="inline-flex items-center gap-1 text-[9px] px-1.5 py-0.5 rounded-full bg-neutral-800 text-neutral-300 border border-neutral-700"
                >
                  {item.icon} {item.name}
                  <button
                    onClick={() => handleRemove(item.type, item.code)}
                    className="text-neutral-600 hover:text-red-400 transition-colors"
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* 标签页 */}
          <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-thin" style={{ scrollbarWidth: 'thin' }}>
            {MODULE_TYPES.map(t => {
              const val = getSelected(t.type);
              const hasVal = val ? (Array.isArray(val) ? val.length > 0 : true) : false;
              return (
                <button
                  key={t.type}
                  onClick={() => setActiveTab(t.type)}
                  className={`shrink-0 flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold transition-all ${
                    activeTab === t.type
                      ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                      : hasVal
                        ? 'bg-neutral-800 text-neutral-300 border border-neutral-700'
                        : 'text-neutral-500 hover:text-neutral-300 border border-transparent hover:border-neutral-700'
                  }`}
                >
                  {t.icon} {t.label}
                  {hasVal && <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />}
                </button>
              );
            })}
          </div>

          {/* 模板选择 */}
          <div className="flex items-center gap-2 px-1">
            <span className="text-[9px] text-neutral-500 shrink-0">模板</span>
            <select
              value={templateId}
              onChange={e => onTemplateChange(e.target.value)}
              className="flex-1 bg-neutral-800 border border-neutral-700 rounded-lg text-[10px] text-neutral-300 px-2 py-1 focus:outline-none focus:border-amber-500/50"
            >
              {PROMPT_TEMPLATES.map(t => (
                <option key={t.id} value={t.id}>{t.name} — {t.description}</option>
              ))}
            </select>
          </div>

          {/* 当前标签页的实例网格 */}
          {activeType && (
            <div className="grid grid-cols-2 gap-1 max-h-48 overflow-y-auto px-1 scrollbar-thin" style={{ scrollbarWidth: 'thin' }}>
              {instances.map(inst => {
                const selected = getSelected(activeType.type);
                const isSelected = Array.isArray(selected)
                  ? selected.includes(inst.code)
                  : selected === inst.code;

                // 提取前面的显示字段
                const schema = activeType.schema;
                const displayFields = Object.entries(schema)
                  .filter(([, v]) => !v.optional)
                  .slice(0, 2)
                  .map(([k]) => inst[k])
                  .filter(Boolean);

                return (
                  <button
                    key={inst.code}
                    onClick={() => handleToggle(inst.code, activeType.type, !!activeType.multiple)}
                    className={`text-left px-2 py-1.5 rounded-lg border transition-all ${
                      isSelected
                        ? 'bg-amber-500/10 border-amber-500/40 text-amber-300'
                        : 'bg-neutral-800/50 border-neutral-800 hover:border-neutral-700 text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold truncate flex-1">{inst.name as string}</span>
                      <span className="text-[8px] text-neutral-600 shrink-0">{inst.code}</span>
                    </div>
                    {displayFields.length > 0 && (
                      <div className="text-[8px] text-neutral-500 truncate mt-0.5">
                        {displayFields.join('，')}
                      </div>
                    )}
                  </button>
                );
              })}
              {instances.length === 0 && (
                <div className="col-span-2 text-[10px] text-neutral-600 text-center py-4">
                  暂无 {activeType.label} 实例
                </div>
              )}
            </div>
          )}

          {/* 提示词预览 */}
          {promptText && (
            <div className="bg-black/40 border border-neutral-800/60 rounded-lg p-2">
              <div className="text-[8px] text-neutral-600 mb-1">模块提示词预览</div>
              <div className="text-[10px] text-neutral-400 leading-relaxed line-clamp-3">{promptText}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}