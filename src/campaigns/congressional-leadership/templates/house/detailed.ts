import type { MessageTemplate } from '../../../../types';
const template: MessageTemplate = {
    id: 'detailed',
    chamber: 'house',
    body: `Dear {{salutation}},

I am an {{stateName}} resident writing about the selection of {{office}} for the {{congress}}.

I would appreciate a clear explanation of your position on {{leader}}'s leadership candidacy, including how you evaluate candidates' records on congressional oversight, U.S. military assistance to Israel, campaign finance, and protection of democratic institutions.

Please explain whether you favor an open and competitive leadership selection process and what criteria you will use when casting your vote.

In particular, I would appreciate your views on the distinction between defensive and offensive weapons transfers, the role of congressional oversight of foreign military assistance, and what accountability measures you believe Congress should consider.

If you have already made a public statement or commitment about leadership selection, please share it. I would also appreciate knowing how constituents can follow the outcome of your caucus leadership vote.

Thank you for considering these questions and providing a substantive response.`,
};
export default template;
