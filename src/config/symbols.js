export const FX_10 = [
'EURUSD','GBPUSD','USDJPY','USDCHF','USDCAD',
'AUDUSD','NZDUSD','EURJPY','EURGBP','EURCHF'
];
export const GOLD_CROSSES = ['XAUUSD','XAUAUD','XAUJPY'];
export const INDICES = [
{ alias: 'US30', vendorSymbol: process.env.INDEX_US30 || '^DJI' },
{ alias: 'NAS100', vendorSymbol: process.env.INDEX_NAS100 || '^NDX' }
];
export const ALL = [ ...FX_10, ...GOLD_CROSSES, ...INDICES.map(i=>i.alias) ];
