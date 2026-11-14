let current: Promise<boolean> | undefined;
export function confirmDialog(message:string):Promise<boolean>{
 if(current)return current;
 const task=new Promise<boolean>(resolve=>{
 const dialog=document.createElement("dialog");dialog.className="m-auto w-[calc(100%-2rem)] max-w-md rounded-2xl border border-white/20 bg-[#111] p-5 text-white shadow-2xl backdrop:bg-black/70";
 const title=document.createElement("h2");title.textContent="Confirmar acción";title.className="text-lg font-medium";title.id="action-confirm-title";dialog.setAttribute("aria-labelledby",title.id);
 const text=document.createElement("p");text.textContent=message;text.className="mt-3 text-sm leading-6 text-white/65";
 const actions=document.createElement("div");actions.className="mt-6 flex justify-end gap-2";
 const cancel=document.createElement("button"),confirm=document.createElement("button");cancel.textContent="Volver";confirm.textContent="Confirmar";cancel.className="min-h-11 rounded-lg border border-white/20 px-4 text-sm";confirm.className="min-h-11 rounded-lg bg-[#ffb700] px-4 text-sm font-medium text-black";
 const previous=document.activeElement as HTMLElement|null;let finished=false;
 function finish(value:boolean){if(finished)return;finished=true;dialog.close();dialog.remove();previous?.focus();resolve(value);}
 cancel.onclick=()=>finish(false);confirm.onclick=()=>finish(true);dialog.oncancel=e=>{e.preventDefault();finish(false);};dialog.onclick=e=>{if(e.target===dialog)finish(false);};
 actions.append(cancel,confirm);dialog.append(title,text,actions);document.body.append(dialog);dialog.showModal();cancel.focus();
 });current=task;void task.finally(()=>{current=undefined;});return task;
}
