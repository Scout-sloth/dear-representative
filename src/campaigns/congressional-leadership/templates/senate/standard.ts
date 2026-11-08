import type { MessageTemplate } from '../../../../types';
const template: MessageTemplate = {
    id: 'standard',
    chamber: 'senate',
    body: `Dear {{salutation}},

I am an {{stateName}} resident writing about the selection of {{office}} for the {{congress}}.

I would appreciate a clear explanation of your position on {{leader}}'s leadership candidacy, including how you evaluate candidates' records on congressional oversight, U.S. military assistance to Israel, campaign finance, and protection of democratic institutions.

Please explain whether you favor an open and competitive leadership selection process and what criteria you will use when casting your vote.

I would welcome a substantive response addressing these questions.`,
};
export default template;
