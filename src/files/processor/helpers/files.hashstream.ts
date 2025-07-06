import { Transform, TransformCallback } from "stream";
import { createHash, Hash } from "crypto";

export class HashStream extends Transform {
  private hash: Hash;
  public digest: string;
  public bytesRead: number = 0;

  constructor() {
    super();
    this.hash = createHash("sha256");
  }

  _transform(chunk: Buffer, encoding: BufferEncoding, callback: TransformCallback) {
    this.hash.update(chunk);
    this.bytesRead += chunk.length;
    this.push(chunk);
    callback();
  }

  _flush(callback: TransformCallback) {
    this.digest = this.hash.digest("hex");
    callback();
  }
}
