import { Schema, model } from 'mongoose';
import { TFactory } from '../types/misc/factory';
import { ModelName } from '../types/misc/model';

const schema = new Schema<TFactory>(
    {
        invoice: {
            $type: Number,
        },
    },
    { timestamps: true, typeKey: '$type' },
);

export default model<TFactory>(ModelName.Factory, schema);
