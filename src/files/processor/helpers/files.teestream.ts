import { Duplex, PassThrough } from "stream";

export class TeeStream extends Duplex {
  private outputs: PassThrough[];

  constructor(...outputs: PassThrough[]) {
    super();
    this.outputs = outputs;
  }

  _write(chunk, encoding, callback) {
    for (const out of this.outputs) out.write(chunk);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    callback();
  }
  _final(callback) {
    for (const out of this.outputs) out.end();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    callback();
  }
}
