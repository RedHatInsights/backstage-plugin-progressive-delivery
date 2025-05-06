import { useState, useEffect } from "react";
import { useApi, fetchApiRef, configApiRef } from "@backstage/core-plugin-api";
import { useEntity } from "@backstage/plugin-catalog-react";

export const useQuerySaasPromotionsData = async () => {

    const fetchApi = useApi(fetchApiRef);
    const config = useApi(configApiRef);
    const { entity } = useEntity();

    const baseUrl: string = config.getString('backend.baseUrl');

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
            resolve(data)
        }).catch((_error) => {
            reject(_error)
            console.error('Error fetching saas promotions data:', error);
        });
    })
};
