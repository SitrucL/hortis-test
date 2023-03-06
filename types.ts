export interface LabelAnnotation {
    mid: string;
    description: string;
    score: number;
    topicality: number;
}

export interface LabelResponse {
    labelAnnotations: LabelAnnotation[];
}

export interface GoogleCloudVisionResponse {
    responses: LabelResponse[];
}
