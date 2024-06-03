import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Link} from "react-router-dom";

import {fetchAllDepartmentAction} from "../actions/departmentActions.js";
import {fetchAllFactorySiteAction} from "../actions/factorySiteActions.js";
import {fetchAllWareHouseAction} from "../actions/wareHouseActions.js";

export const LeftMenu = () => {
    const dispatch = useDispatch();

    useEffect(()=> {
        dispatch(fetchAllDepartmentAction());
        dispatch(fetchAllFactorySiteAction());
        dispatch(fetchAllWareHouseAction());
    }, []);

    const {departments} = useSelector(state => {return state.department});
    const {factorySites} = useSelector(state => {return state.factorySite});
    const {wareHouses} = useSelector(state => {return state.wareHouse});

    return (
    <>
        <div id="sidebar">
            <ul className="tree">
                <li>
                    Управление <a href="/UserGroup/user/index">пользователями</a> и <a href="/UserGroup/group/index">группами</a>
                </li>
                <li>
                    <a href="/Registries/item/index">Реестр обьектов</a>
                </li>
                <li>
                    <a href="/Registries/product/index">Реестр производственных издержек</a>
                </li>
                <hr/>
                <li>
                    <details open>
                        <summary><Link to="/Departments/index">Подразделения</Link></summary>
                        <ul>
                            {(Object.keys(departments)).map(departmentId => (

                                <li>

                                    <details open>
                                        <summary>
                                             <Link to={{pathname: "/Departments/details", search: `?id=${departments[departmentId].id}`}}>{departments[departmentId].name.replace(/\s/g, '') ? departments[departmentId].name : "Без названия"}</Link>
                                        </summary>
                                        <ul>
                                            <li>

                                                <details onClick={()=>{}}>
                                                    <summary>
                                                        <Link to={{pathname: "/FactorySites/index", search: `?id=${departments[departmentId].id}`}}>Производственные участки</Link>
                                                    </summary>
                                                    <ul>


                                                        {Object.keys(factorySites).filter((factorySiteId) => factorySites[factorySiteId].departmentId === departments[departmentId].id).map(factorySite_id => (

                                                            <li>
                                                                <Link to={{pathname: "/FactorySites/details", search: `?id=${factorySites[factorySite_id].id}`}}>{factorySites[factorySite_id].name.replace(/\s/g, '') ? factorySites[factorySite_id].name : "Без названия"}</Link>

                                                            </li>
                                                        ))}
                                                    </ul>
                                                </details>
                                            </li>
                                            <li>
                                                <details>
                                                    <summary>
                                                        <Link to={{pathname: "/WareHouses/index", search: `?id=${departments[departmentId].id}`}}>Склады</Link>
                                                    </summary>
                                                    <ul>


                                                        {Object.keys(wareHouses).filter((wareHouseId) => wareHouses[wareHouseId].departmentId === departments[departmentId].id).map(wareHouse_id => (

                                                            <li>
                                                                <Link to={{pathname: "/WareHouses/details", search: `?id=${wareHouses[wareHouse_id].id}`}}>{wareHouses[wareHouse_id].name.replace(/\s/g, '') ? wareHouses[wareHouse_id].name : "Без названия"}</Link>

                                                            </li>
                                                        ))}
                                                    </ul>
                                                </details>
                                            </li>
                                        </ul>
                                    </details>
                                </li>
                            ))}

                        </ul>
                    </details>
                </li>
            </ul>
        </div>
    </>

    );
};
