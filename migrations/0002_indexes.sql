create index if not exists idx_ohlcv_symbol_time on ohlcv(symbol, timeframe, ts desc);
create index if not exists idx_signals_symbol_time on signals(symbol, timeframe, created_at desc);
create index if not exists idx_outbox_status on outbox_events(status, created_at);
