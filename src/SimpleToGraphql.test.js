import SimpleSchema from 'simpl-schema';

import { stripIndents } from 'common-tags';

import SimpleToGraphql from './SimpleToGraphql';

describe('SchemaBridge', () => {
  describe('schema', () => {
    const Texts = new SimpleSchema({
      title: String,
      description: String,
      teaserText: String,
      status: {
        type: SimpleSchema.Integer,
      },
      aFloat: Number,
    });
    const Schema = new SimpleSchema({
      _id: {
        type: String,
      },
      name: {
        type: String,
        label: 'Item name',
      },
      ownerId: {
        type: String,
        label: 'Owner identification',
      },
      createdAt: {
        type: String,
        label: 'Item creation date',
      },
      updatedAt: {
        type: String,
        label: 'Item last update',
      },
      texts: Texts,
    });

    it('can transform a basic simpl-schema to a graphql typedef', () => {
      expect(
        SimpleToGraphql.schema({
          schema: Texts,
          name: 'MyTexts',
        }),
      ).toEqual(stripIndents`
        type MyTexts {

          title: String
          description: String
          teaserText: String
          status: Int
          aFloat: Float

        }
      `);
    });

    it('can transform a nested simpl-schema', () => {
      expect(
        SimpleToGraphql.schema({
          schema: Schema,
          name: 'MyType',
        }),
      ).toEqual(stripIndents`
        type MyTypeTexts {

          title: String
          description: String
          teaserText: String
          status: Int
          aFloat: Float
        }

        type MyType {

          _id: String
          name: String
          ownerId: String
          createdAt: String
          updatedAt: String
          texts: MyTypeTexts

        }
      `);
    });

    it('can can add `extend` to the base type', () => {
      expect(
        SimpleToGraphql.schema({
          schema: Schema,
          name: 'MyType',
          options: { extend: true },
        }),
      ).toEqual(stripIndents`
        type MyTypeTexts {
          
          title: String
          description: String
          teaserText: String
          status: Int
          aFloat: Float
        }

        extend type MyType {

          _id: String
          name: String
          ownerId: String
          createdAt: String
          updatedAt: String
          texts: MyTypeTexts

        }
      `);
    });

    it('can can also return an input type', () => {
      expect(
        SimpleToGraphql.schema({
          schema: Schema,
          name: 'MyInput',
          options: { inputType: true },
        }),
      ).toEqual(stripIndents`
        input MyInputTexts {
          
          title: String
          description: String
          teaserText: String
          status: Int
          aFloat: Float
        }

        input MyInput {

          _id: String
          name: String
          ownerId: String
          createdAt: String
          updatedAt: String
          texts: MyInputTexts

        }
      `);
    });

    it('and combination of extend and input', () => {
      expect(
        SimpleToGraphql.schema({
          schema: Schema,
          name: 'MyInput',
          options: { extend: true, inputType: true },
        }),
      ).toEqual(stripIndents`
        input MyInputTexts {
          
          title: String
          description: String
          teaserText: String
          status: Int
          aFloat: Float
        }

        extend input MyInput {

          _id: String
          name: String
          ownerId: String
          createdAt: String
          updatedAt: String
          texts: MyInputTexts

        }
      `);
    });
  });
});
