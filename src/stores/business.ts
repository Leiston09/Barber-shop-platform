import {defineStore} from "pinia";
import {computed,ref} from "vue";
import axios from "axios";
export const contactFields=[{key:"address",label:"Dirección"},{key:"city",label:"Ciudad y provincia"},{key:"phone",label:"Teléfono"},{key:"whatsapp",label:"WhatsApp (con código de país)"},{key:"email",label:"Correo de contacto"},{key:"mapsUrl",label:"Enlace de Google Maps"},{key:"instagram",label:"Instagram"},{key:"facebook",label:"Facebook"},{key:"tiktok",label:"TikTok"},{key:"website",label:"Sitio web"}];
export const useBusinessStore=defineStore("business",()=>{
 const data=ref<Record<string,any>>(Object.fromEntries([...contactFields.map(f=>[f.key,""]),["version",-1]])),loaded=ref(false),error=ref("");
 let pending:Promise<void>|undefined;
 async function load(force=false){if(pending)return pending;if(loaded.value&&!force)return;pending=(async()=>{try{const r=await axios.get((import.meta.env.VITE_API_URL||"/api")+"/business",{timeout:15000});data.value=r.data;loaded.value=true;error.value="";}catch{error.value="No pudimos consultar los datos de contacto.";}finally{pending=undefined;}})();return pending;}
 const whatsapp=computed(()=>data.value.whatsapp?"https://wa.me/"+data.value.whatsapp.replace(/\D/g,""):"");
 const links=computed(()=>[
 {label:"WhatsApp",value:data.value.whatsapp,href:whatsapp.value},
 {label:"Teléfono",value:data.value.phone,href:data.value.phone?"tel:"+data.value.phone.replace(/[^+\d]/g,""):""},
 {label:"Correo",value:data.value.email,href:data.value.email?"mailto:"+data.value.email:""},
 ...["instagram","facebook","tiktok","website"].map(key=>({label:({instagram:"Instagram",facebook:"Facebook",tiktok:"TikTok",website:"Sitio web"} as any)[key],value:data.value[key],href:data.value[key]}))
 ].filter(link=>!!link.href));
 return{data,loaded,error,load,whatsapp,links};
});
