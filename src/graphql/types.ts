import { Field, InputType } from 'type-graphql';

@InputType()
export class CreatePanelInput {
    @Field()
    label!: string;

    @Field()
    value!: string;

    @Field()
    unit!: string;
}

@InputType()
export class UpdatePanelInput {
    @Field()
    id!: string;

    @Field()
    label!: string;

    @Field()
    value!: string;

    @Field()
    unit!: string;
}

@InputType()
export class DeletePanelInput {
    @Field()
    id!: string;
}
