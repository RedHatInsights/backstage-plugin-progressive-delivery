import { useState, useEffect } from "react";
import { useApi, fetchApiRef, configApiRef } from "@backstage/core-plugin-api";
import { useEntity } from "@backstage/plugin-catalog-react";

export const useQuerySaasPromotionsData = async () => {

    const [result, setResult] = useState("{}");
    const [error, setError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const fetchApi = useApi(fetchApiRef);
    const config = useApi(configApiRef);
    const { entity } = useEntity();

    const baseUrl: string = config.getString('backend.baseUrl');

    //const getSaasPromotionsData = async () => {
    return new Promise((resolve, reject) => {
        fetchApi.fetch(`${baseUrl}/api/proxy/inscope-resources/resources/json/saas-promotions.json`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        }).then(response => {
            if (!response.ok) {
                throw new Error(`Network response was not ok ${response.statusText}`);
            }

            return response.json();
        }).then(data => {
            console.log("saas-promotions:", data);
            //setResult(data);
            //setIsLoading(false)
            resolve(data)
        }).catch((_error) => {
            //setError(true);
            reject(_error)
            console.error('Error fetching saas promotions data:', error);
        });
    })
    //}

    //useEffect(() => {
    //    getSaasPromotionsData()
    //    console.log("is this giving me data?", result)
    //}, []);

    //return { result, error, isLoading };
};
