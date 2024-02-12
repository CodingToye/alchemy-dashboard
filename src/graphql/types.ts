import { Field, InputType } from 'type-graphql';

@InputType()
export class CreatePanelInput {
    @Field()
    label!: string;

    @Field()
    value!: string;

    @Field()
    suffix!: string;
}

@InputType()
export class UpdatePanelInput {
    @Field()
    id!: number;

    @Field()
    label!: string;

    @Field()
    value!: string;

    @Field()
    suffix!: string;
}

@InputType()
export class DeletePanelInput {
    @Field()
    id!: number;
}
