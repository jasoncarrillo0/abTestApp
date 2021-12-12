import { RdxActionPayload } from "../rootReducer"
import { ACTIONS, CreateABTestState, CREATE_AB_TEST_INIT_STATE } from "./interfaces"


export const createAbTestReducer = (state: CreateABTestState = CREATE_AB_TEST_INIT_STATE, action: RdxActionPayload): CreateABTestState => {
    switch (action.type) {
        case ACTIONS.SET_BASIC_FIELDS:
            return {
                ...state,
                basicFields: action.payload
            }
        case ACTIONS.SET_BASIC_FIELD:
            const { field, val } = action.payload;
            return {
                ...state,
                basicFields: {
                    ...state.basicFields,
                    dateError: ["startDate", "endDate"].includes(field) && state.basicFields.dateError ? ( // reset error 
                        false
                    ) : (
                        state.basicFields.dateError
                    ),
                    [field]: val
                }
            }
        case ACTIONS.ADD_DESIGN:
            return {
                ...state,
                designs: action.payload.name ? (
                    [...state.designs, action.payload]
                ) : (
                    state.designs
                ),
                designError: action.payload.name ? (
                    state.designError
                ) : (
                    true
                )  
            }
        case ACTIONS.UPDATE_DESIGN:
            let { idx, updatedDesign } = action.payload;
            return {
                ...state,
                designs: state.designs.map((d, i) => i === idx ? updatedDesign : d)
            }
        case ACTIONS.DELETE_DESIGN:
            return {
                ...state,
                designs: state.designs.filter((d, i) => i !== action.payload)
            }
        case ACTIONS.SET_IS_SKIPPING:
            return {
                ...state,
                skippingDesigns: action.payload,
                designs: action.payload === true ? [] : state.designs
            }
        case ACTIONS.SET_AB_TEST_LOADING:
            return {
                ...state,
                loading: action.payload
            }
        case ACTIONS.RESET_FIELDS:
            return {
                ...CREATE_AB_TEST_INIT_STATE
            }
        default:
            return { ...state }
    }
}