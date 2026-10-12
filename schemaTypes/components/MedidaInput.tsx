import {Fragment} from 'react'
import {Box, Flex, Text} from '@sanity/ui'
import {ObjectInputMember, type ObjectInputProps} from 'sanity'

// Muestra los campos del objeto en una fila, separados por guiones: [ ]-[ ]-[ ]-[ ]
export function MedidaInput(props: ObjectInputProps) {
  const {
    members,
    renderAnnotation,
    renderBlock,
    renderField,
    renderInlineBlock,
    renderInput,
    renderItem,
    renderPreview,
  } = props

  return (
    <Flex align="flex-end" gap={2}>
      {members.map((member, index) => (
        <Fragment key={member.key}>
          {index > 0 && (
            <Box paddingBottom={3}>
              <Text weight="semibold">-</Text>
            </Box>
          )}
          <Box flex={1}>
            <ObjectInputMember
              member={member}
              renderAnnotation={renderAnnotation}
              renderBlock={renderBlock}
              renderField={renderField}
              renderInlineBlock={renderInlineBlock}
              renderInput={renderInput}
              renderItem={renderItem}
              renderPreview={renderPreview}
            />
          </Box>
        </Fragment>
      ))}
    </Flex>
  )
}
