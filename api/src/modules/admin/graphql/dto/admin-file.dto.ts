import { ObjectType, Field, ID, Int } from '@nestjs/graphql';

@ObjectType()
export class AdminFileDto {
  @Field(() => ID)
  id: number;

  @Field()
  filename: string;

  @Field()
  key: string;

  @Field()
  contentType: string;

  @Field(() => Int, { nullable: true })
  size?: number;

  @Field()
  status: string;

  @Field(() => Int)
  uploadedBy: number;

  @Field()
  createdAt: Date;
}
