import cctx from "ccxt";
import config from "config";

export class Binance {
  constructor(public apiKey: string, public secret: string) {
    this.apiKey = apiKey;
    this.secret = secret;
  }

  initiate() {
    return new cctx.binance({
      apiKey: this.apiKey,
      secret: this.secret,
    });
  }
}

export class Kucoin {
  constructor(
    public apiKey: string,
    public secret: string,
    public password: string
  ) {
    this.apiKey = apiKey;
    this.secret = secret;
    this.password = password;
  }

  initiate() {
    return new cctx.kucoin({
      apiKey: this.apiKey,
      secret: this.secret,
      password: this.password,
    });
  }
}

const binance = new Binance(
  config.get("CCTX.BINANCE.APIKEY"),
  config.get("CCTX.BINANCE.SECRET")
);

const kucoin = new Kucoin(
  config.get("CCTX.KUCOIN.APIKEY"),
  config.get("CCTX.KUCOIN.SECRET"),
  config.get("CCTX.KUCOIN.PASSWORD")
);

export const binanceCCTX = binance.initiate();
export const kucoinCCTX = kucoin.initiate();
