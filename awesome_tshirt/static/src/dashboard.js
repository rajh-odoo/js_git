/** @odoo-module **/
import { registry } from "@web/core/registry";
import { Layout } from "@web/search/layout";
import { getDefaultConfig } from "@web/views/view";
import { useService } from "@web/core/utils/hooks";
import { Domain } from "@web/core/domain";
import { Card } from "./card/card";
import { loadJS } from "@web/core/assets";
import { Component, useSubEnv, onWillStart,useEffect,useRef } from "@odoo/owl";


class AwesomeDashboard extends Component {
    setup() {
        useSubEnv({
            config: {
                ...getDefaultConfig(),
                ...this.env.config,
            },
        });
        this.chart=null;
        this.action = useService("action");
        this.rpc = useService("rpc");
        this.tshirtService=useService("tshirtService");
        this.cardString = {
            nb_new_orders:this.env._t("Number of new orders this month"),
            total_amount:this.env._t("Total amount of new orders this month"),
            average_quantity:this.env._t("Average amount of t-shirt by order this month"),
            nb_cancelled_orders:this.env._t("Number of cancelled orders this month"),
            average_time:this.env._t("Average time for an order to go from 'new' to 'sent' or 'cancelled'"),
        };
        onWillStart(async () => {
            // this.statistics = await this.rpc("/awesome_tshirt/statistics");
            this.statistics = await this.tshirtService.result();
            await loadJS("/web/static/lib/Chart/Chart.js");
        });
        useEffect(() => this.renderchart());
        
        this.canvasRef=useRef("canvas");
    }
    renderchart() {
        if (this.chart) {
            this.chart.destroy();
        }
        const ctx = this.canvasRef.el;
        this.chart = new Chart(ctx,{
            type: 'pie',
            data:{
                datasets: [{
                    data: Object.values(this.statistics['orders_by_size']),
                    backgroundColor:["#00DFA2","#0079FF","#FF0060"] 
                }],
                labels:Object.keys(this.statistics["orders_by_size"]),
            },
            options: {
                onClick:(evt) =>{
                    var activePoints = this.chart.getElementsAtEventForMode(evt, 'point', this.chart.options);
                    var firstPoint = activePoints[0];
                    var label = this.chart.data.labels[firstPoint._index];
                    let domain=`[('size','=','${label}'),('state','!=', 'cancelled')]`;
                    this.openOrders("Orders",domain);
                }
            }
        });
    }
    CustomerView() {
        this.action.doAction("base.action_partner_form");
    }
    openOrders(title, domain) {
        this.action.doAction({
            type: "ir.actions.act_window",
            name: this.env._t(title),
            res_model: "awesome_tshirt.order",
            views: [
                [false, "tree"],
                [false, "form"],
            ],
            domain: new Domain(domain).toList(),
        });
    }
    Orders7Days() {
        const domain =
            "[('create_date','>=', (context_today() - datetime.timedelta(days=7)).strftime('%Y-%m-%d'))]";
            this.openOrders("Last 7 days orders", domain);
    }

    Cancelled7Days() {
        const domain =
            "[('create_date','>=', (context_today() - datetime.timedelta(days=7)).strftime('%Y-%m-%d')), ('state','=', 'cancelled')]";
            this.openOrders("Last 7 days cancelled orders", domain);
    }
}
AwesomeDashboard.components = { Layout,Card };
AwesomeDashboard.template = "awesome_tshirt.clientaction";
registry.category("actions").add("awesome_tshirt.dashboard", AwesomeDashboard);




// const myService = {
//     dependencies: ["notification"],
//     start(env, { notification }) {
//         let counter = 1;
//         setInterval(() => {
//             notification.add(`Tick Tock ${counter++}`);
//         }, 2000);
//     }
// };
// registry.category("services").add("myService", myService);