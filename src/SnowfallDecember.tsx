import Snowfall from "react-snowfall";

export default function SnowfallDecember() {
    const time = new Date();
    return (time.getMonth() === 11 || (time.getMonth() === 0 && time.getDate() <= 7)) && <Snowfall speed={[1.0, 2.0]} snowflakeCount={100} />;
}