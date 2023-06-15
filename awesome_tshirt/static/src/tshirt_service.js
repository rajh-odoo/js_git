/** @odoo-module */
import { registry } from "@web/core/registry";
import { memoize } from "@web/core/utils/functions";

export const tshirtService = {
    dependencies: ["rpc"],
    start(env, { rpc }) {
        return {
            result:memoize(()=>{
                return rpc("/awesome_tshirt/statistics")
            })
            
        };
    },
};
registry.category("services").add("tshirtService", tshirtService);