export enum Area {
    neck,
    upperBack,
    lowerBack,
    sacroiliac,
    shoulderLeft,
    shoulderRight,
    elbowLeft,
    elbowRight,
    wristLeft,
    wristRight,
    thumbLeft,
    thumbRight,
    fingersLeft,
    fingersRight,
    hipLeft,
    hipRight,
    kneeLeft,
    kneeRight,
    ankleFootLeft,
    ankleFootRight,
    bigToeLeft,
    bigToeRight
}


export interface AreaState {
    Area: Area
    State: number
}

export class Results {

    private results: any;

    public AreaStates: Array<AreaState> = new Array<AreaState>();
    public Age!: number;
    public Base!: number;

    constructor(resultsJson: any) {
        this.results = JSON.parse(resultsJson);;
        this.Initalize();
    }

    Initalize(): void {

        /*
        Object.values(Area)
            .filter(value => typeof value === 'string')
            .map(e => this.AreaStates.push(new AreaState(e as Area, 0)))
        */
        this.Age = this.results["age"];
        this.Base = Math.min(this.GetBase(), 100);
        this.AdjustAreas();
    }

    GetBase(): number {
        let base = 100;

        // Every 2 years after 20 is minus 1 point on all joints. Until the joint gets to 70%,
        // then -2 points per year. Under 60%, -5 points per year.
        for (let i = 21; i <= this.Age; i++)
        {
            base -= this.GetAgeAdjustment(base, i);
        }

        let currentVal = this.results["ai-growing-up"];
        base += currentVal;


        if (currentVal >= -3)
        {
            base += this.results["active-growing-up"];
        }

        base += this.results["laid-up-fever-chills"] + (this.results["laid-up-fever-chills-ai"] ?? 0);
        base -= this.results["autoimmune"] ? ((this.results["autoimmune-duration"] ?? 0) * 5) : 0;
        base -= this.results["ai-week"] ? ((this.results["ai-week-count"] ?? 0) * 2) : 0;
        base += this.results["ai-now"];
        base -= this.results["cancer-prev"] ? 10: 0;
        base -= this.results["cancer-now"] ? 10: 0;
        return Math.min(Math.max(base, 0), 100);
    }

    GetAgeAdjustment (state: number, age: number): number {
        if (state < 60) return 5;
        if (state < 70) return 2;
        return age % 2;
    }

    AdjustAreas(): void {

        // Shingles
        if (this.results["shingles"]) {
            this.results["joints-shingles"]?.forEach((e: any) => {
                this.AdjustArea(e, (e["severity"] - (e["ai"] ? 5: 0)) * e["count"]);
            });
        }

        // Sprains
        if (this.results["sprain"]) {
            this.results["joints-sprains"]?.forEach((e: any) => {
                this.AdjustArea(e, (e["severity"] - (e["ice-heat"] ? 5: 0) + (e["ai"] ? -5 : 5)) * e["count"]);
            });
        }

        // Car accidents
        const carAccidentAdj = (this.results["accident-major"] * -10) + (this.results["accident-minor"] * -5);
        if (carAccidentAdj < 0) {
            const carAccidentInfo = this.results["joints-accident"];
            if (carAccidentInfo)
            {
                carAccidentInfo.forEach((e: any) => {
                    this.AdjustArea(e, (e["severity"] - (e["ice-heat"] ? 5: 0) + e["ai"] ? -5 : 5));
                });


                if (!carAccidentInfo.find((x:any) => x["joint"] === "Neck")) {
                    this.AdjustArea({joint: "Neck", side:''}, carAccidentAdj);
                }
                if (!carAccidentInfo.find((x:any) => x["joint"] === "Shoulder" && x["side"] === "r")) {
                    this.AdjustArea({joint: "Shoulder", side:'r'}, carAccidentAdj);
                }
                if (!carAccidentInfo.find((x:any) => x["joint"] === "Hip" && x["side"] === "r")) {
                    this.AdjustArea({joint: "Hip", side:'r'}, carAccidentAdj);
                }
                if (!carAccidentInfo.find((x:any) => x["joint"] === "Lower Back")) {
                    this.AdjustArea({joint: "Lower Back", side:''}, carAccidentAdj);
                }
                if (!carAccidentInfo.find((x:any) => x["joint"] === "Knee" && x["side"] === "r")) {
                    this.AdjustArea({joint: "Knee", side:'r'}, carAccidentAdj);
                }
                if (!carAccidentInfo.find((x:any) => x["joint"] === 'Below Lower Back (Sacroiliac)')) {
                    this.AdjustArea({joint: 'Below Lower Back (Sacroiliac)', side:''}, carAccidentAdj);
                }
            }
        }


        // Hard falls
        this.AdjustArea({joint: 'Below Lower Back (Sacroiliac)', side:''}, (-10 * (this.results["hard-fall"] ?? 0)));

        // Prolo
        this.results["joints-prolo"]?.forEach((e: any) => {
            this.AdjustArea(e, (e["count-moc"] * 10 + e["count"] * 5));
        });


        // Pain / Loose
        this.results["joints-pain-loose"]?.forEach((e: any) => {
            this.AdjustArea(e, 74, true);
        });

        // Replaced / Changing
        this.results["joints-replaced-or-changing"]?.forEach((e: any) => {
            this.AdjustArea(e, 50, true);
        });
    }

    GetSide(side: String) {
        return '_' +  (side === 'l'? 'Left' : 'Right');
    }

    GetAreaState(area: Area): number {
        const areaState = this.AreaStates.find(x => x.Area === area);
        return areaState? Math.max (this.Base + areaState.State, 0): this.Base;
    }

    AdjustArea(e: any, amt: number, isMax: boolean = false): void {
        const joint = e["joint"];

        if (!joint)
            return;

        const area = Area[joint as keyof typeof Area];
        let areaState = this.AreaStates.find(x => x.Area == area);
        if (!areaState) {
            areaState = {Area: area, State: 0};
            this.AreaStates.push(areaState);
        }

        // IsMax flag indicates set the state to the amt passed if state is larger
        if (isMax)
            areaState.State = Math.min(areaState.State, amt - this.Base);
        else
            areaState.State += amt;
    }
}
