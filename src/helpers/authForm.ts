export function resetAuthForm(id:string) { (document.getElementById(id) as HTMLFormElement | null)?.reset(); }
export function authFormError(name:string,value:string,values:Record<string,string>,required:boolean):string {
 const labels:Record<string,string>={name:"tu nombre",email:"tu correo",password:"tu contraseña",password_confirm:"la confirmación de contraseña"};
 if(required&&!value.trim())return "Completa "+(labels[name]||"este campo")+".";
 if(!value || !required && !value.trim())return "";
 if(name==="email"&&(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())||value.length>254))return "Escribe un correo válido.";
 if(name==="name"&&(value.trim().length<3||value.trim().length>120))return "El nombre debe tener entre 3 y 120 caracteres.";
 if(name==="phone"&&!/^\+?[0-9 ()-]{7,20}$/.test(value.trim()))return "Revisa el número de teléfono.";
 if(name==="password"&&(value.trim().length<8||new TextEncoder().encode(value).length>72))return "La contraseña debe tener al menos 8 caracteres y hasta 72 bytes.";
 if(name==="password_confirm"&&value!==values.password)return "Las contraseñas no coinciden.";
 return "";
}
