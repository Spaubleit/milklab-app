package org.gpp.milklab.config

import com.fasterxml.jackson.core.JsonParser
import com.fasterxml.jackson.core.TreeNode
import com.fasterxml.jackson.databind.DeserializationContext
import com.fasterxml.jackson.databind.JsonDeserializer
import com.fasterxml.jackson.databind.node.NumericNode
import com.fasterxml.jackson.databind.node.TextNode
import java.time.LocalDateTime
import java.time.Month

class CustomDeserializer: JsonDeserializer<LocalDateTime>() {
    override fun deserialize(p: JsonParser?, ctxt: DeserializationContext?): LocalDateTime {
        val oc = p?.codec
        val node = oc?.readTree<TreeNode>(p) as TreeNode

        return LocalDateTime.of(
                (node.get("year") as NumericNode).asInt(),
                Month.valueOf((node.get("month") as TextNode).asText()),
                (node.get("dayOfMonth") as NumericNode).asInt(),
                (node.get("hour") as NumericNode).asInt(),
                (node.get("minute") as NumericNode).asInt(),
                (node.get("second") as NumericNode).asInt(),
                (node.get("nano") as NumericNode).asInt()
        )
    }

}