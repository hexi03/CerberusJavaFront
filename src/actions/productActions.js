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
import { updateToken } from "./authActions.js";
export const fetchAllProductAction = () => {
    return (dispatch) => {
        const authToken = localStorage.getItem('authToken');
        axios.get(API_URI + "/registry/fetchProduct", {
            crossDomain: true,
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        })
        .then(response => {
            dispatch(onFetchAllProductAction(response.data));
        })

        .catch(error => {
            dispatch(onErrorAction(error.message));
        }).finally(_ => updateToken());
    };
}

export const fetchOneProductAction = (id) => {
    return (dispatch) => {
        const authToken = localStorage.getItem('authToken');
        axios.get(API_URI + "/registry/fetchProduct", {
            crossDomain: true,
            headers: {
                'Authorization': `Bearer ${authToken}`
            },
            params: { id }
        })
        .then(response => {
            if (response.data.length === 0) {
                dispatch(onFetchOneNotFoundProductAction(id));
            } else {
                dispatch(onFetchOneProductAction(response.data[0]));
            }
        })

        .catch(error => {
            dispatch(onErrorAction(error.message));
        }).finally(_ => updateToken());
    }
}

export const createProductAction = (product) => {
    return (dispatch) => {
        const authToken = localStorage.getItem('authToken');
        axios.post(API_URI + "/registry/addProduct", {
            producedItemId: product.producedItemId,
            requirementIds: product.requirementIds
        }, {
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Origin': API_ORIGIN
            }
        })
        .then(response => {
            product.id = response.data;
            dispatch(onCreateProductAction(product));
        })

        .catch(error => {
            dispatch(onErrorAction(error.message));
        }).finally(_ => updateToken());
    }
}

export const updateProductAction = (product) => {
    return (dispatch) => {
        const authToken = localStorage.getItem('authToken');
        axios.put(API_URI + "/registry/updateProduct", {
            id: product.id,
            producedItemId: product.producedItemId,
            requirementIds: product.requirementIds
        }, {
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Origin': API_ORIGIN
            }
        })
        .then(() => {
            dispatch(onUpdateProductAction(product));
        })

        .catch(error => {
            dispatch(onErrorAction(error.message));
        }).finally(_ => updateToken());
    }
}

export const deleteProductAction = (product) => {
    return (dispatch) => {
        const authToken = localStorage.getItem('authToken');
        axios.delete(API_URI + "/registry/removeProduct", {
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Origin': API_ORIGIN
            },
            params: { id: product.id }
        })
        .then(() => {
            dispatch(onDeleteProductAction(product.id));
        })

        .catch(error => {
            dispatch(onErrorAction(error.message));
        }).finally(_ => updateToken());
    }
}

// SYNC
export const onFetchAllProductAction = (products) => ({
    scope: 'PRODUCT',
    action: FETCHALL,
    type: OK,
    products: products.map(product => (new ProductBuilder()).setId(product.id.id).setProducedItemId(product.producedItemId.id).setRequirementIds(product.requirements).build())
});

export const onFetchOneProductAction = (product) => ({
    scope: 'PRODUCT',
    action: FETCHONE,
    type: OK,
    product: (new ProductBuilder()).setId(product.id.id).setProducedItemId(product.producedItemId.id).setRequirementIds(product.requirements).build()
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
