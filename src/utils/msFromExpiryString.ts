export default function msFromExpiryString(expStr: string) {
    const num = parseInt(expStr.slice(0, -1), 10);
    const unit = expStr.slice(-1);
    if (unit === "m") return num * 60 * 1000;
    if (unit === "h") return num * 60 * 60 * 1000;
    if (unit === "d") return num * 24 * 60 * 60 * 1000;
    return 0;
}