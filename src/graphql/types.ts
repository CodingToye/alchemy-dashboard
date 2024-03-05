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

    @Field()
    tag!: string;
}

@InputType()
export class CreateFilterInput {
    @Field()
    tag!: string;

    @Field()
    activated!: boolean;
}

@InputType()
export class ActivateFilterInput {
    @Field()
    id!: string;

    @Field()
    activated!: boolean;
}

@InputType()
export class DeleteFilterInput {
    @Field()
    id!: string;
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
