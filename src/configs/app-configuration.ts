export default function AppConfigurations() {
    const configurations = {
        defaultPassword: process.env.USER_DEFAULT_PASSWORD || "fremaaUser@2023",
    };

    return configurations;
};