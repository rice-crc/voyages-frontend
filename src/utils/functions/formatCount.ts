export const formatCount = (count: number) => {
    console.log({ count })
    const formattedCount = count.toLocaleString();
    return count >= 1 ? formattedCount : 'No';
};