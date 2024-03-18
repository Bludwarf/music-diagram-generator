const NOT_FOUND_CONTENT = 'NOT FOUND';

export function checkXmlContent(xmlContent: string): void | never {

  if (xmlContent.substring(0, NOT_FOUND_CONTENT.length) === NOT_FOUND_CONTENT) {
    throw new Error('XML file not found')
  }
}
