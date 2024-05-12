import { API_URI, API_ORIGIN } from "../consts.js";
import axios from "axios";
import {
    CREATE,
    DELETE,
    FETCHALL,
    FETCHNOTFOUND,
    FETCHONE,
    onErrorAction,
    OK,
    UPDATE
} from "./actions.js";
import { ProductBuilder } from "../builders/productBuilder.js";

export const fetchAllProductAction = () => {
    return async (dispatch) => {
        try {
            const authToken = localStorage.getItem('authToken');
            const response = await axios.get(API_URI + "/product/fetch", {
                crossDomain: true,
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });
            dispatch(onFetchAllProductAction(response.data));
        } catch (error) {
            dispatch(onErrorAction(error.message));
        }
    };
}

export const fetchOneProductAction = (id) => {
    return async (dispatch) => {
        try {
            const authToken = localStorage.getItem('authToken');
            const response = await axios.get(API_URI + "/product/fetch", {
                crossDomain: true,
                headers: {
                    'Authorization': `Bearer ${authToken}`
                },
                params: { id }
            });
            if (response.data.length === 0) {
                dispatch(onFetchOneNotFoundProductAction(id));
            } else {
                dispatch(onFetchOneProductAction(response.data[0]));
            }
        } catch (error) {
            dispatch(onErrorAction(error.message));
        }
    }
}

export const createProductAction = (product) => {
    return async (dispatch) => {
        try {
            const authToken = localStorage.getItem('authToken');
            const response = await axios.post(API_URI + "/product/create", {
                producedItemId: product.producedItemId,
                requirementIds : product.producedItemId
            }, {
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Origin': API_ORIGIN
                }
            });
            product.id = response.data;
            dispatch(onCreateProductAction(product));
        } catch (error) {
            dispatch(onErrorAction(error.message));
        }
    }
}

export const updateProductAction = (product) => {
    return async (dispatch) => {
        try {
            const authToken = localStorage.getItem('authToken');
            await axios.put(API_URI + "/product/update", {
                id: product.id,
                producedItemId: product.producedItemId,
                requirementIds : product.producedItemId
            }, {
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Origin': API_ORIGIN
                }
            });
            dispatch(onUpdateProductAction(product));
        } catch (error) {
            dispatch(onErrorAction(error.message));
        }
    }
}

export const deleteProductAction = (product) => {
    return async (dispatch) => {
        try {
            const authToken = localStorage.getItem('authToken');
            await axios.delete(API_URI + "/product/delete", {
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Origin': API_ORIGIN
                },
                params: { id: product.id }
            });
            dispatch(onDeleteProductAction(product.id));
        } catch (error) {
            dispatch(onErrorAction(error.message));
        }
    }
}

// SYNC
export const onFetchAllProductAction = (products) => ({
    scope: 'PRODUCT',
    action: FETCHALL,
    type: OK,
    products: products.map(product => (new ProductBuilder()).setId(product.id).setProducedItemId(product.producedItemId).setRequirementIds(product.setRequirementIds).build())
});

export const onFetchOneProductAction = (product) => ({
    scope: 'PRODUCT',
    action: FETCHONE,
    type: OK,
    product: (new ProductBuilder()).setId(product.id).setProducedItemId(product.producedItemId).setRequirementIds(product.setRequirementIds).build()
});

export const onFetchOneNotFoundProductAction = (id) => ({
    scope: 'PRODUCT',
    action: FETCHNOTFOUND,
    type: OK,
    id: id
});

export const onCreateProductAction = (product) => ({
    scope: 'PRODUCT',
    action: CREATE,
    type: OK,
    product: product
});

export const onUpdateProductAction = (product) => ({
    scope: 'PRODUCT',
    action: UPDATE,
    type: OK,
    product: product
});

export const onDeleteProductAction = (id) => ({
    scope: 'PRODUCT',
    action: DELETE,
    type: OK,
    id: id
});
