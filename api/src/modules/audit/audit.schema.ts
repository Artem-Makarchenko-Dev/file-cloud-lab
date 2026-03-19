import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Audit {
  @Prop({ type: Number, required: false })
  userId?: number;

  @Prop({ required: true })
  type: string;

  @Prop()
  route: string;

  @Prop()
  method: string;

  @Prop()
  status: number;

  @Prop()
  ip?: string;

  @Prop()
  userAgent?: string;

  @Prop()
  duration?: number;
}

export const AuditSchema = SchemaFactory.createForClass(Audit);
