import express from "express";
import { GoogleCloudVisionResponse } from "../types";

import reference_plants from "./data.json" assert { type: "json" };

const app = express();
const port = process.env.PORT || 3000;

app.post("/", (req, res) => {
    //This would take in a picture from the user and pass it to the the `suggestSimilarPlants` function
    res.send(suggestSimilarPlants());
});

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});

const DUMMY_API_RESPONSE: GoogleCloudVisionResponse = {
    responses: [
        {
            labelAnnotations: [
                {
                    mid: "/m/0c9ph5",
                    description: "Flower",
                    score: 0.98266506,
                    topicality: 0.98266506
                },
                {
                    mid: "/m/05s2s",
                    description: "Plant",
                    score: 0.9680366,
                    topicality: 0.9680366
                },
                {
                    mid: "/m/01g5v",
                    description: "Blue",
                    score: 0.93063515,
                    topicality: 0.93063515
                },
                {
                    mid: "/m/09ggk",
                    description: "Purple",
                    score: 0.89626455,
                    topicality: 0.89626455
                },
                {
                    mid: "/m/01bwr",
                    description: "Botany",
                    score: 0.8941453,
                    topicality: 0.8941453
                },
                {
                    mid: "/m/016q19",
                    description: "Petal",
                    score: 0.8888217,
                    topicality: 0.8888217
                },
                {
                    mid: "/m/024nvz",
                    description: "Hyacinth",
                    score: 0.87902606,
                    topicality: 0.87902606
                },
                {
                    mid: "/m/0fbflw",
                    description: "Terrestrial plant",
                    score: 0.86614746,
                    topicality: 0.86614746
                },
                {
                    mid: "/m/04sjm",
                    description: "Flowering plant",
                    score: 0.78989714,
                    topicality: 0.78989714
                },
                {
                    mid: "/m/018ssc",
                    description: "Groundcover",
                    score: 0.78496,
                    topicality: 0.78496
                }
            ]
        }
    ]
};
//Based on the incoming request body, we will need to check the existing entries and do a comparison to see which one has the most overlap. We will then return the result of the most similar entry. Probably just return the top 5 matches

//Think we only really care about the score and description of each label so those will be the ones used for the comparison

const suggestSimilarPlants = () => {
    // in production this would use the picture submitted by the user, make an API request to Google Cloud Vision API and use the result to suggest similar plants that already exist within Hortis collection
    const normalised_api_response = DUMMY_API_RESPONSE.responses[0].labelAnnotations.map((label) => {
        return label.description;
        // score: label.score
    });

    const normalised_reference_plants = Object.fromEntries(
        Object.entries(reference_plants).map(([k, v]) => [
            k,
            v.map(
                (labelKey) => labelKey.description
                // score: labelKey.score
            )
        ])
    );

    //find the entries with the most matching labels
    const overlappingResults = Object.fromEntries(
        Object.entries(normalised_reference_plants).map(([k, v]) => {
            const overlap = v.filter((label) => normalised_api_response.includes(label));
            return [k, { overlap, count: overlap.length }];
        })
    );

    //sort and return the top 3 entries with the most overlap
    const topMatches = Object.keys(
        Object.fromEntries(
            Object.entries(overlappingResults)
                .sort((a, b) => b[1].count - a[1].count)
                .slice(0, 3)
        )
    );

    return topMatches;
};
