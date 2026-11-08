export type Chamber = 'senate' | 'house';
export type Official = {id:string;name:string;state:string;chamber:Chamber;district?:number;contactUrl:string;websiteUrl:string;email?:string;contactStatus:'verified'|'review';notes?:string};
export type Petition = {id:string;title:string;url:string;platform:string;scope:'house'|'senate'|'both';organizer?:string;signatures?:number;checkedAt?:string;description:string};
export type TemplateId = 'short'|'standard'|'detailed';
