import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  strict: false,
})
export class User extends Document {
  @Prop({
    unique: true,
  })
  readonly email: string;

  @Prop()
  readonly password: string;

  @Prop()
  readonly KAI_client_id: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
