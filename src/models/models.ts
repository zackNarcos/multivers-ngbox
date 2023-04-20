export interface ComponentModel {
    selector: string;
    templateUrl: string;
    className: string;
    componentTsPath: string;
    // templateUrlPath: string;
}

export interface PipeModel {
    className: string;
    pipeTsPath: string;
}

export interface ServiceModel {
    className: string;
    serviceTsPath: string;
}

export interface DirectiveModel {
    selector: string;
    templateUrl: string;
    className: string;
    directiveTsPath: string;
}
