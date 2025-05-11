
export const convertTextProperty = (property:string) => property.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())
