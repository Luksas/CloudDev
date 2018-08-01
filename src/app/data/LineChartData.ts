export class LineDataSet {
    label: string;
    fill: boolean = false;
    borderColor: string = "#ffffff";
    data: number[] = [];
}

export class LineChartData {
    labels: string[] = [];
    datasets: LineDataSet[] = [];
}