import mongoose, { Types } from 'mongoose';

const Schema = mongoose.Schema;
export const testDB = mongoose.connection.useDb('testDB');
interface Timestamps {
    createdAt: string,
    updatedAt?: string
}

// ------------------------------------------------------{{  DESIGN  }}------------------------------------------------------------
export interface DesignInterface extends Timestamps {
    name: string,
    comments: string,
    creator: string,
    score: number,
    imageUrl: string,
    type: "image" | "text",
    designText: string
};
export interface LeanDesignDoc extends DesignInterface {
    _id: Types.ObjectId,
    __v: number
}
const DesignSchema = new Schema<LeanDesignDoc>({
    name: {
        type: String,
        required: true
    },
    comments: {
        type: String,
        default: ""
    },
    creator: {
        type: String,
        required: true
    },    
    score: {
        type: Number,
        default: 0,
        required: true
    },
    imageUrl: {
        type: String,
        default: ""
    },
    type: {
        type: String,
        required: true
    },
    designText: {
        type: String,
        default: ""
    },
    updatedAt: String,
    createdAt: {
        type: String,
        required: true
    },
});
DesignSchema.pre('save', function(next){
    this.updatedAt = new Date().toISOString();
    next();
});
// we use findOneAndUpdate, because findByIdAndUpdate is a wrapper around findOneAndUpdate
DesignSchema.pre('findOneAndUpdate', function(next){
    this.set('updatedAt', new Date().toISOString())
    next();
});
const Design = testDB.model<LeanDesignDoc>("Design", DesignSchema);

export { Design }