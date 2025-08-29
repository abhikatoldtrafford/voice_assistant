// src/lib/ai/tools/AITool.ts

export enum PatameterType {
    String = 'string',
    Number = 'number',
    Boolean = 'boolean',
    Object = 'object',
    Array = 'array',
    Null = 'null'
}

/**
 * Type definition for tool parameter schema
 */
type ParameterSchema = {
    type: PatameterType;
    description?: string;
    enum?: string[] | number[];
    properties?: Record<string, ParameterSchema>;
    items?: ParameterSchema;
    required?: string[];
    [key: string]: any; // For additional JSON Schema properties
};

/**
 * Type definition for AI tool signature/definition
 */
export type AIToolDefinition = {
    type: 'function';
    name: string;
    description: string;
    parameters: {
        type: 'object';
        properties: Record<string, ParameterSchema>;
        required?: string[];
    };
};

/**
 * Base class for AI function tools
 * T is the type of the input parameters
 * R is the type of the return value
 */
export abstract class AITool<T extends Record<string, any> = any, R = any> {
    /**
     * The name of the tool, must match the name expected by the AI service
     */
    abstract readonly name: string;

    /**
     * A detailed description of what the tool does, how it works,
     * and when it should be used
     */
    abstract readonly description: string;

    /**
     * The parameter schema for the tool, following JSON Schema format
     */
    abstract readonly parameters: {
        properties: Record<string, ParameterSchema>;
        required?: string[];
    };

    /**
     * The implementation of the tool that will be executed when the tool is called
     * @param params The parameters passed to the tool
     * @returns The result of the tool execution
     */
    abstract execute(params: T, context: any): Promise<R>;

    /**
     * Generates the tool definition required by the AI service
     * @returns The AI tool definition
     */
    getDefinition(): AIToolDefinition {
        return {
            type: 'function',
            name: this.name,
            description: this.description,
            parameters: {
                type: 'object',
                properties: this.parameters.properties,
                required: this.parameters.required
            }
        };
    }

    /**
     * Factory method to create a new instance of a tool
     * @param toolClass The tool class to instantiate
     * @returns A new instance of the tool
     */
    static create<T extends AITool>(toolClass: new () => T): T {
        return new toolClass();
    }
}

/**
 * Utility function to convert tool classes to AI tool definitions
 * @param tools Array of tool classes or instances
 * @returns Array of AI tool definitions
 */
export function getToolDefinitions(tools: (AITool | (new () => AITool))[]): AIToolDefinition[] {
    return tools.map(tool => {
        if (typeof tool === 'function') {
            // If it's a class, instantiate it
            return new tool().getDefinition();
        } else {
            // If it's already an instance
            return tool.getDefinition();
        }
    });
}

/**
 * Utility type for tool parameters
 */
export type ToolParameters<T extends AITool> = T extends AITool<infer P, any> ? P : never;

/**
 * Utility type for tool return value
 */
export type ToolReturnType<T extends AITool> = T extends AITool<any, infer R> ? R : never;