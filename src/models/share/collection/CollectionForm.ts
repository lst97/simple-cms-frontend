import CollectionBaseSchema, { CollectionInfo } from "./CollectionBaseSchema";
import { TypeSetting } from "./AttributeTypeSettings";

export class CollectionForm implements CollectionBaseSchema {
  kind: "collection";
  collectionName?: string; // db key name and path name
  info?: CollectionInfo;
  attributes: TypeSetting[];

  constructor() {
    this.attributes = [];
    this.kind = "collection";
  }
}
