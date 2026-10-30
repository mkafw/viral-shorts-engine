import React from 'react';

export const Physics_Response = ({ children, target, effect, depth }: any) => (
  <div className="my-4 p-4 border-l-4 border-orange-500 bg-orange-50/10 rounded-r-lg">
    <div className="text-xs uppercase tracking-widest text-orange-500 font-bold mb-2">
      物理反馈: {target} / {effect} ({depth})
    </div>
    <div className="text-sm italic">{children}</div>
  </div>
);

export const Synesthesia = ({ children, type, model }: any) => (
  <div className="my-4 p-4 border-l-4 border-purple-500 bg-purple-50/10 rounded-r-lg">
    <div className="text-xs uppercase tracking-widest text-purple-500 font-bold mb-2">
      通感转译: {type} / 模式: {model}
    </div>
    <div className="text-sm font-medium">{children}</div>
  </div>
);

export const Character_Anchor = ({ children, id, eyes, gear }: any) => (
  <div className="relative my-8 p-6 border border-zinc-800 rounded-xl bg-zinc-900/50">
    <div className="absolute -top-3 left-4 px-2 bg-zinc-900 text-xs font-mono text-zinc-400 border border-zinc-800">
      CHARACTER_ID: {id} | EYES: {eyes} | GEAR: {gear}
    </div>
    {children}
  </div>
);

export const Director_Instruction = ({ children, hook, focus }: any) => (
  <div className="my-6 p-6 bg-blue-500/5 border border-blue-500/20 rounded-xl">
    <h4 className="text-blue-400 font-bold mb-2 flex items-center">
      <span className="mr-2">🎬</span> 导演指令 (HOOK: {hook})
    </h4>
    <div className="text-sm leading-relaxed text-zinc-300">
      重点关注: <span className="text-blue-300 font-medium">{focus}</span>
      <p className="mt-2">{children}</p>
    </div>
  </div>
);
