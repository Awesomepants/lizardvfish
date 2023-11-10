const isLizardBodyPart = (body) => {
    const lizardBodyPartNames = ["lizardHead","lizardSkull","lizardButt"];
    const matches = (element) => {
        return body.label === element;
    }
    return lizardBodyPartNames.some(matches);
}