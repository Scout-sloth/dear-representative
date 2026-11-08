import type { MessageTemplate } from '../../../../types';
const template: MessageTemplate = {
    id: 'short',
    chamber: 'senate',
    body: `Dear {{salutation}},

I am an {{stateName}} resident writing about the selection of {{office}} for the {{congress}}.

Please let me know whether you plan to support {{leader}} for a leadership role, what factors will guide your decision, and whether you support a competitive selection process.

Thank you for your response.`,
};
export default template;
