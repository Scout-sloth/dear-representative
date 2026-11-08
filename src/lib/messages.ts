import type {Official,TemplateId} from '../types';
export const templateLabels:Record<TemplateId,string>={short:'Short',standard:'Standard',detailed:'Detailed'};
export function makeMessage(official:Official,kind:TemplateId):string {
 const honorific=official.chamber==='senate'?'Senator':'Representative';
 const surname=official.name.split(' ').at(-1);
 const leader=official.chamber==='senate'?'Chuck Schumer':'Hakeem Jeffries';
 const office=official.chamber==='senate'?'Senate Democratic leadership':'House Democratic leadership and the speakership';
 const opening=`Dear ${honorific} ${surname},\n\nI am an Oregon resident writing about the selection of ${office} for the 120th Congress.`;
 if(kind==='short')return `${opening}\n\nPlease let me know whether you plan to support ${leader} for a leadership role, what factors will guide your decision, and whether you support a competitive selection process.\n\nThank you for your response.`;
 const middle=`I would appreciate a clear explanation of your position on ${leader}'s leadership candidacy, including how you evaluate candidates' records on congressional oversight, U.S. military assistance to Israel, campaign finance, and protection of democratic institutions.\n\nPlease explain whether you favor an open and competitive leadership selection process and what criteria you will use when casting your vote.`;
 if(kind==='standard')return `${opening}\n\n${middle}\n\nI would welcome a substantive response addressing these questions.`;
 return `${opening}\n\n${middle}\n\nIn particular, I would appreciate your views on the distinction between defensive and offensive weapons transfers, the role of congressional oversight of foreign military assistance, and what accountability measures you believe Congress should consider.\n\nIf you have already made a public statement or commitment about leadership selection, please share it. I would also appreciate knowing how constituents can follow the outcome of your caucus leadership vote.\n\nThank you for considering these questions and providing a substantive response.`;
}
