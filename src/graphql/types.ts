import { Field, InputType } from 'type-graphql';

@InputType()
export class CreatePanelInput {
    @Field()
    label!: string;

    @Field()
    target!: string;

    @Field()
    value!: string;

    @Field()
    original!: string;

    @Field()
    unit!: string;
}

@InputType()
export class UpdatePanelInput {
    @Field()
    id!: string;

    @Field()
    target!: string;

    @Field()
    label!: string;

    @Field()
    original!: string;

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

@InputType()
export class InstallToolInput {
    @Field()
    label!: string;
}
