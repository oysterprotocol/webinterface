import uploadActions from "../actions/upload-actions";
import { UPLOAD_STATUSES } from "../../config";

const initState = {};

const reducer = (state = initState, action) => {
  switch (action.type) {
    case uploadActions.PAYMENT_CONFIRMED: {
      const { filename, handle, numberOfChunks } = action.payload;
      const now = Date.now();
      return {
        ...state,
        [handle]: {
          handle,
          filename,
          numberOfChunks,
          status: UPLOAD_STATUSES.PENDING,
          uploadProgress: 0,
          createdAt: now,
          updatedAt: now
        }
      };
    }

    case uploadActions.UPLOAD_SUCCESS: {
      const { handle } = action.payload;
      const hist = {
        ...state[handle],
        status: UPLOAD_STATUSES.FAILED,
        updatedAt: Date.now()
      };
      return { ...state, [handle]: hist };
    }

    case uploadActions.UPLOAD_ERROR: {
      const { handle } = action.payload;
      const hist = {
        ...state[handle],
        status: UPLOAD_STATUSES.FAILED,
        updatedAt: Date.now()
      };
      return { ...state, [handle]: hist };
    }

    default:
      return state;
  }
};

export default reducer;
