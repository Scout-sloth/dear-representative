import type {Official} from '../types';
// Official domains are supplied; exact contact paths should be rechecked before launch.
export const officials:Official[]=[
{id:'wyden',name:'Ron Wyden',state:'OR',chamber:'senate',contactUrl:'https://www.wyden.senate.gov/contact',websiteUrl:'https://www.wyden.senate.gov/',contactStatus:'review'},
{id:'merkley',name:'Jeff Merkley',state:'OR',chamber:'senate',contactUrl:'https://www.merkley.senate.gov/connect/contact/',websiteUrl:'https://www.merkley.senate.gov/',contactStatus:'review'},
{id:'bonamici',name:'Suzanne Bonamici',state:'OR',chamber:'house',district:1,contactUrl:'https://bonamici.house.gov/contact',websiteUrl:'https://bonamici.house.gov/',contactStatus:'review'},
{id:'bentz',name:'Cliff Bentz',state:'OR',chamber:'house',district:2,contactUrl:'https://bentz.house.gov/',websiteUrl:'https://bentz.house.gov/',contactStatus:'review',notes:'Contact-form path pending verification'},
{id:'dexter',name:'Maxine Dexter',state:'OR',chamber:'house',district:3,contactUrl:'https://dexter.house.gov/',websiteUrl:'https://dexter.house.gov/',contactStatus:'review',notes:'Contact-form path pending verification'},
{id:'hoyle',name:'Val Hoyle',state:'OR',chamber:'house',district:4,contactUrl:'https://hoyle.house.gov/',websiteUrl:'https://hoyle.house.gov/',contactStatus:'review',notes:'Office may restrict web-form submissions by district ZIP code'},
{id:'bynum',name:'Janelle Bynum',state:'OR',chamber:'house',district:5,contactUrl:'https://bynum.house.gov/',websiteUrl:'https://bynum.house.gov/',contactStatus:'review',notes:'Contact-form path pending verification'},
{id:'salinas',name:'Andrea Salinas',state:'OR',chamber:'house',district:6,contactUrl:'https://salinas.house.gov/',websiteUrl:'https://salinas.house.gov/',contactStatus:'review',notes:'Contact-form path pending verification'}
];
