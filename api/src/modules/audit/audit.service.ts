import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Audit } from './audit.schema';

@Injectable()
export class AuditService {
  constructor(
    @InjectModel(Audit.name)
    private readonly auditModel: Model<Audit>,
  ) {}

  async log(payload: Partial<Audit>) {
    await this.auditModel.create(payload);
  }
}
