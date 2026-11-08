import type { Campaign } from '../../types';
import { details } from './details';
import { petitions } from './petitions';
import houseShort from './templates/house/short';
import houseStandard from './templates/house/standard';
import houseDetailed from './templates/house/detailed';
import senateShort from './templates/senate/short';
import senateStandard from './templates/senate/standard';
import senateDetailed from './templates/senate/detailed';
export const congressionalLeadership: Campaign = {
    id: 'congressional-leadership',
    title: 'Congressional leadership',
    details,
    templates: {
        house: { short: houseShort, standard: houseStandard, detailed: houseDetailed },
        senate: { short: senateShort, standard: senateStandard, detailed: senateDetailed },
    },
    subject: 'Question about congressional leadership — {{officialName}}',
    signature: '\n\nSincerely,\n{{senderName}}\n{{senderCity}}, {{stateName}}',
    senderFallbacks: { name: '[Your name]', city: '[City]' },
    petitions,
};
