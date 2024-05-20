import { ReportType } from "../builders/reportTypes.js";



export const reportFilter = (queryParams, reports) => {
    console.log("Репорты до фильтрации");
    console.log(reports);
    console.log("Параметры фильтрации");
    console.log(queryParams);
    const res = Object.entries(reports).reduce((acc, [key, rep]) => {
        console.log(key);
        console.log(rep);
        if (queryParams.id){
            if(queryParams.id === rep.id) {
                acc[key] = rep;
                return acc;
            }else return acc;
        }

        if (queryParams.typeCriteria) {
            switch (queryParams.typeCriteria){
                case ReportType.WH_GENERIC:
                    if (
                        (rep.type === ReportType.WH_INVENTARISATION ||
                        rep.type === ReportType.WH_RELEASE ||
                        rep.type === ReportType.WH_REPLENISHMENT ||
                        rep.type === ReportType.WH_WS_REPLENISHMENT ||
                        rep.type === ReportType.WH_SHIPMENT) &&
                        rep.wareHouseId === queryParams.locationSpecificId
                    )
                        acc[key] = rep;
                    break;
                case ReportType.WH_INVENTARISATION:
                    if (
                        rep.type === ReportType.WH_INVENTARISATION &&
                        rep.wareHouseId === queryParams.locationSpecificId
                    ) acc[key] = rep;
                    break;
                case ReportType.WH_RELEASE:
                    if (
                        rep.type === ReportType.WH_RELEASE &&
                        rep.wareHouseId === queryParams.locationSpecificId
                    ) acc[key] = rep;
                    break;
                case ReportType.WH_REPLENISHMENT:
                    if (
                        rep.type === ReportType.WH_REPLENISHMENT &&
                        rep.wareHouseId === queryParams.locationSpecificId
                    ) acc[key] = rep;
                    break;
                case ReportType.WH_WS_REPLENISHMENT:
                    if (
                        rep.type === ReportType.WH_WS_REPLENISHMENT &&
                        rep.wareHouseId === queryParams.locationSpecificId
                    ) acc[key] = rep;
                    break;
                case ReportType.WH_SHIPMENT:
                    if (
                        rep.type === ReportType.WH_SHIPMENT &&
                        rep.wareHouseId === queryParams.locationSpecificId
                    ) acc[key] = rep;
                    break;
                case ReportType.FS_GENERIC:
                    if (
                        (rep.type === ReportType.FS_SUP_REQ ||
                        rep.type === ReportType.FS_WORKSHIFT) &&
                        rep.factorySiteId === queryParams.locationSpecificId
                    )
                        acc[key] = rep;
                    break;
                case ReportType.FS_SUP_REQ:
                    if (
                        rep.type === ReportType.FS_SUP_REQ &&
                        rep.factorySiteId === queryParams.locationSpecificId
                    ) acc[key] = rep;
                    break;
                case ReportType.FS_WORKSHIFT:
                    if (
                        rep.type === ReportType.FS_WORKSHIFT &&
                        rep.factorySiteId === queryParams.locationSpecificId
                    ) acc[key] = rep;
                    break;
                default:
                    console.log("Invalid report type: " + queryParams.typeCriteria);
                    throw new Error('Report type is not valid: ' + queryParams.typeCriteria);
            }
        } else {
            acc[key] = rep;
        }


        return acc;
    }, {});

    console.log("Результат фильтрации");
    console.log(res);
    return res;

}
